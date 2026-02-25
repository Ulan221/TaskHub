declare module '@firebase/auth/dist/rn/index.js' {
    import { Persistence } from 'firebase/auth';
    export const getReactNativePersistence: (storage: any) => Persistence;
}