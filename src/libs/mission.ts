
export type Payload = {
  id: string,
  payload_mass_kg: number | null,
  nationality: string
}

export type MissionDetail = {
  id: string,
  name: string,
  payloads: (Payload | null)[]
}

export type Mission = {
  name: string,
  total: number,
  color: string
}