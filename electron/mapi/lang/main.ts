import {Files} from "../file/main";
import {AppEnv} from "../env";
import {JsonUtil, StrUtil} from "../../lib/util";
import {ConfigLang} from "../../config/lang";
import {ipcMain} from "electron";

const fileSyncer = {
    lock: {},
    readJson: async function (file: string) {
        if (this.lock[file]) {
            return new Promise<any>((resolve) => {
                setTimeout(() => {
                    resolve(this.readJson(file))
                }, 100)
            })
        }
        this.lock[file] = true
        let filePath = Files.absolutePath([
            AppEnv.appRoot,
            file,
        ].join('/'))
        const sourceContent = (await Files.read(filePath)) || '{}'
        this.lock[file] = sourceContent
        return JSON.parse(sourceContent)
    },
    writeJson: async function (file: string, data: any) {
        if (!this.lock[file]) {
            return new Promise<any>((resolve) => {
                setTimeout(() => {
                    resolve(this.writeJson(file, data))
                }, 100)
            })
        }
        let filePath = Files.absolutePath([
            AppEnv.appRoot,
            file,
        ].join('/'))
        const jsonString = JsonUtil.stringifyOrdered(data)
        if (jsonString !== this.lock[file]) {
            await Files.write(filePath, jsonString)
        }
        this.lock[file] = false
    }
}

const writeSourceKey = async (key: string) => {
    const json = await fileSyncer.readJson('src/lang/source.json')
    const sourceIds = Object.values(json)
    if (!json[key]) {
        let success = false
        let id = StrUtil.hashCode(key)
        for (let i = 0; i < 10; i++) {
            if (!sourceIds.includes(id)) {
                json[key] = id
                success = true
                break
            }
            id = StrUtil.uuid().substring(0, 8)
        }
        if (!success) {
            console.log('writeSourceKey.error', key)
        }
    }
    await fileSyncer.writeJson('src/lang/source.json', json)
    const jsonLang = await fileSyncer.readJson(`src/lang/${ConfigLang.getLocale()}.json`)
    jsonLang[json[key]] = key
    await fileSyncer.writeJson(`src/lang/${ConfigLang.getLocale()}.json`, jsonLang)
}

const writeSourceKeyUse = async (key: string) => {
    const json = await fileSyncer.readJson('src/lang/source-use.json')
    if (!json[key]) {
        json[key] = 1
    } else {
        json[key]++
    }
    await fileSyncer.writeJson('src/lang/source-use.json', json)
}

ipcMain.handle('lang:writeSourceKey', async (_, key) => {
    await writeSourceKey(key)
})
ipcMain.handle('lang:writeSourceKeyUse', async (_, key) => {
    await writeSourceKeyUse(key)
})

export default {
    writeSourceKey,
    writeSourceKeyUse
}
