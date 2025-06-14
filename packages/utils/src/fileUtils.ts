import { access, constants, readFile } from 'fs/promises'
import { asyncComplement } from './fpUtils'

export async function fileExists(filePath: string): Promise<boolean> {
  try { await access(filePath, constants.F_OK); return true }
  catch { return false }
}

export const fileDoesNotExist = asyncComplement(fileExists)

export const readTextFile = async (filePath: string): Promise<string> => {
  if (await fileDoesNotExist(filePath)) {
    throw new Error(`readTextFile(): File does not exist at ${filePath}`)
  }
  try {
    return await readFile(filePath, 'utf8')
  } catch (error) {
    throw new Error(`Failed to read file at ${filePath}: ${error.message}`)
  }
}
