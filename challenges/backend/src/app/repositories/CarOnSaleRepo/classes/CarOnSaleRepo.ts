//import axios from "axios";
import { inject, injectable } from "inversify";
import { AuthenticationResponse } from "../dtos/AuthenticationResponse";
import { RunningAuctionList } from "../dtos/RunningAuctionsList";
import { ICarOnSaleRepo } from "../interface/ICarOnSaleRepo";
import { AxiosInstance } from "axios";
import { DependencyIdentifier } from "../../../DependencyIdentifiers";

@injectable()
export class CarOnSaleRepo implements ICarOnSaleRepo {
    runningAuctionListEndpoint: string
    authEndpoint: string
    email: string;
    password: string;
    /**
     *
     */
    constructor(@inject(DependencyIdentifier.AXIOS_INSTANCE) private axiosInstance: AxiosInstance) {
        this.runningAuctionListEndpoint = process.env.RUNNING_AUCTION_LIST_ENDPOINT || "";
        this.authEndpoint = process.env.AUTHENTICATION_ENDPOINT || "";
        this.email = process.env.EMAIL || "";
        this.password = process.env.PASSWORD || "";
    }
    public async getListOfRunningAuctions(): Promise<RunningAuctionList> {
        const authResponse = await this.Authenticate();

        const headers = {
            authtoken: authResponse.token,
            userId: authResponse.userId
        }
        try {
            const { data } = await this.axiosInstance
                .get<RunningAuctionList>(this.runningAuctionListEndpoint,
                    { headers });
            return data;
        }
        catch (ex) {
            throw ex;
        }
    }

    private async Authenticate(): Promise<AuthenticationResponse> {
        try {
            const { data } = await this.axiosInstance
                .put(`${this.authEndpoint}${this.email}`,
                    {
                        password: this.password
                    });
            const response: AuthenticationResponse = {
                token: data.token,
                userId: data.userId
            }
            return response;
        }
        catch (ex) {
            throw ex;
        }
    }

}