import Device from '@vk/dmx-types'

declare module '@vk/dmx' {

  class Universe {
    constructor()

    getDevices(): Promise<Device[]>

    addDevice(device: number): Promise<Device>

    deleteDevice(device: number): Promise<Device>

    deleteAllDevices(): Promise<Device[]>
  }

  class DMX {
    constructor()

    getUniverses(): Promise<Universe[]>

    addUniverse(universe: number): Promise<Universe>

    deleteUniverse(universe: number): Promise<Universe>

    deleteAllUniverses(): Promise<Universe[]>
  }
}
