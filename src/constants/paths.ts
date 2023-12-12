export const PATHS = {
  PATH_MAIN: '/',
  PATH_AUTH: '/auth',
  PATH_PLUGIN: '/:plugin/*',
  PATH_404: '*',
  media: '/media',
  mediaFolder: (id: string) => `/media/${id}`,
};
