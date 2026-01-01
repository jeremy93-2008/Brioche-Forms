import { TEMP_PREFIX } from '@/_constants/temp'
import { v7 as uuidv7 } from 'uuid'

export const isTempId = (id: string) => id.startsWith(TEMP_PREFIX)

export const createTempId = () => `${TEMP_PREFIX}${uuidv7()}`
