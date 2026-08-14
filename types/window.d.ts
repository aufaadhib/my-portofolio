export {};

declare global {
  interface Window {
    __portfolioPageReadyPath?: string;
    __portfolioRevealPending?: boolean;
  }
}
