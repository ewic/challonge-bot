import axios, { AxiosInstance } from 'axios';
import { color } from "../functions";
import { TournamentParams } from '../types';

const CHALLONGE_TOKEN = process.env.CHALLONGE_TOKEN
const BASEURL = `https://api.challonge.com/v1/`

export class Challonge {
    rest: AxiosInstance

    constructor() {
        this.rest = axios.create({
            baseURL: BASEURL,
            params: {
                api_key: CHALLONGE_TOKEN,
            }
        });
    }

    async fetchTournaments() {
        try {
            const res = await this.rest.get('tournaments.json')
            return res.data;
        } catch(error) {
            console.log(error);
            return false;
        }
    }

    async createTournament(params: TournamentParams) {
        const tournamentParams: TournamentParams = {
            name: params.name,
            tournament_type: params.tournament_type, 
            description: params.description,
        }

        const res = await this.rest.post('tournaments.json', tournamentParams);
        return res.data;
    }

    async activeTournamentExists() {
    }
    
    async destroyTournament(id: number) {
        const res = await this.rest.delete(`tournaments/${id}.json`);
        return res;
    }

    async getActiveTournament() {
        let tournaments = this.fetchTournaments();
        console.log(tournaments);
    }

    async signup(user: {name: string}) {
        this.getActiveTournament();
        // const res = await axios.post(``, )
        // console.log(res);
    }
}