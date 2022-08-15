import { Container } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { Logger } from "./services/Logger/classes/Logger";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import { AuctionMonitorApp } from "./AuctionMonitorApp";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { CarOnSaleClient } from "./services/CarOnSaleClient/classes/CarOnSaleClient";
import { ICarOnSaleRepo } from "./repositories/CarOnSaleRepo/interface/ICarOnSaleRepo";
import dotenv from "dotenv";
import { axiosInstance } from "../app/interceptors/CarOnSaleAPIInterceptor";
import { AxiosInstance } from "axios";
import { CarOnSaleRepo } from "./repositories/CarOnSaleRepo/classes/CarOnSaleRepo";


dotenv.config();
axiosInstance.defaults.baseURL = process.env.CAR_ON_SALE_BASE_URL
/*
 * Create the DI container.
 */
export const container = new Container({
    defaultScope: "Singleton",
});

/*
 * Register dependencies in DI environment.
 */
container.bind<ILogger>(DependencyIdentifier.LOGGER).to(Logger);

container.bind<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT).to(CarOnSaleClient);

container.bind<ICarOnSaleRepo>(DependencyIdentifier.CAR_ON_SALE_REPO).to(CarOnSaleRepo);

container.bind<AxiosInstance>(DependencyIdentifier.AXIOS_INSTANCE)
    .toConstantValue(axiosInstance);
/*
 * Inject all dependencies in the application & retrieve application instance.
 */
const app = container.resolve(AuctionMonitorApp);

/*
 * Start the application
 */
(async () => {
    await app.start();
})();
