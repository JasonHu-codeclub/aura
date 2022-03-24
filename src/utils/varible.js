/*
 * Created: 2021-05-25 09:56:51
 * Author : Jan
 * Last Modified: 2021-06-15 09:51:49
 * Modified By: Jan
 * Copyright (c) 2019. ���ڰ��������ܿƼ����޹�˾. All Rights Reserved.
 */
import { getHost } from './tool'
export const imgBaseUrl = process.env.NODE_ENV === 'development' ? getHost() : ''
export const initToken = '8ISrMLiQiPS6fqEculxFwJjcMMtIjvbDTblLoRSaAZlTF3Mf8jmSFKS2wqa8tU7KvZPuTzAhDan3FiVqNNrSbCvfWmRRKmAguE84rF7G1wK2pztasFQYVHEEXdEz3jsF'
