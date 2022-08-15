import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";
import { AggregatedAuction } from "../dtos/AggregatedAuction";
import { inject, injectable } from "inversify";
import { DependencyIdentifier } from "../../../DependencyIdentifiers";
import { ICarOnSaleRepo } from "../../../repositories/CarOnSaleRepo/interface/ICarOnSaleRepo";
import { MathUtil } from "../../../util/MathUtil";
import { AuctionItem } from "../../../repositories/CarOnSaleRepo/dtos/RunningAuctionsList";

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {

    /**
     *
     */
    public constructor(@inject(DependencyIdentifier.CAR_ON_SALE_REPO) private carOnSaleRepo: ICarOnSaleRepo) {
    }

    public async getAggregatedAuctions(): Promise<AggregatedAuction> {
        const listOfRunningAuctions = await this.carOnSaleRepo.getListOfRunningAuctions();

        const { items } = listOfRunningAuctions || [];

        const filteredItems = items?.
            filter(item => item.minimumRequiredAsk !== null && item.minimumRequiredAsk !== 0);

        const aggregatedAuction: AggregatedAuction = {
            avgNumOfBids: this.getAvgNumOfBids(filteredItems),
            total: filteredItems?.length || 0, // TODO safe checks
            avgPercentageOfProgress: this.getAvgPercentageOfProgress(filteredItems)
        }
        return aggregatedAuction;
    }

    private getAvgNumOfBids(items: AuctionItem[]): number {
        const numOfBids = items?.map(item => item.numBids) || [];
        return MathUtil.Average(numOfBids);
    }

    private getAvgPercentageOfProgress(items: AuctionItem[]): number {
        const avgPercentages = items?.map(item => {
            return 100 * (item.currentHighestBidValue /
                (item.minimumRequiredAsk))
        })
            || [];

        const avgPercentageOfProgress = MathUtil.Average(avgPercentages);
        return MathUtil.trunc(avgPercentageOfProgress, 4);
    }
}