export interface ISong {
    id: number;
    title: string;
    artist: string;
    file: string;
}

export interface ISlideshow {
    id: number;
    url: string;
    caption?: string; 
}