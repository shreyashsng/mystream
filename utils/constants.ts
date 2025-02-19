export const ENDPOINTS = {
  MOVIE: {
    SEARCH: (query: string) => `https://www.omdbapi.com/?s=${query}&type=movie&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`,
    DETAILS: (id: string) => `https://www.omdbapi.com/?i=${id}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`,
    WATCH: (id: string) => `https://vidsrc.xyz/embed/movie/${id}`
  },
  TV: {
    SEARCH: (query: string) => `https://www.omdbapi.com/?s=${query}&type=series&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`,
    DETAILS: (id: string) => `https://www.omdbapi.com/?i=${id}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`,
    WATCH: (id: string, season: number, episode: number) => 
      `https://vidsrc.xyz/embed/tv?imdb=${id}&season=${season}&episode=${episode}`
  }
}

export type ContentType = 'movie' | 'series' 