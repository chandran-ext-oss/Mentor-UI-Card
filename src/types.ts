export interface Mentor {
  name: string
  role: string
  company: string
  location: string
  sessions: number
  rating: number
  experience: string
  language: string
  attendance: string
  photo: string
  tags: { topRated: boolean; availableNow: boolean }
}
