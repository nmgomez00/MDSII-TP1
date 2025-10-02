// interfaz para subscriptores de la simulación de mercado
export interface IMarketSimulationSubscriber {
    update(): void;
}