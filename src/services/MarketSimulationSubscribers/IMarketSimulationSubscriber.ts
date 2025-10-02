export interface IMarketSimulationSubscriber {
    update(marketData?:any): void;
}