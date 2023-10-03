export interface User {
  name: string;
  username: string;
}

export interface MediaPhoto {
  type: 'photo';
  url: string;
}

export interface MediaVideo {
  type: 'video';
  thumbnail: string;
}

export type Media = MediaPhoto | MediaVideo;
