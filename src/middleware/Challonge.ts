import axios from 'axios';
import { color } from "../functions";
import { TournamentData, TournamentParams } from '../types';

class PrivateChallonge {

    private _activeTournamentId: number | undefined = undefined;
    get activeTournamentId(): number | undefined {
        return this._activeTournamentId;
    }
    set activeTournamentId(value: number | undefined) {
        if (this._activeTournamentId !== undefined) {
            console.error("Active tournament already exists, please unset the active tournament")
        } else {
            this._activeTournamentId = value;
        }
    }

//#region Global Interactions
    async fetchTournaments(state?: string): Promise<TournamentData[]> {
        try {
            const res = await axios.get('tournaments.json')
            let filtered = res.data;
            filtered = filtered.map((item: any) => {
                const tournament = item.tournament;
                return {
                    id: tournament['id'],
                    name: tournament['name'],
                    description: tournament['description'],
                    url: tournament['url'],
                    tournament_type: tournament['tournament_type'],
                    state: tournament['state'],
                }
            })
            if (state) {
                filtered = filtered.filter((item: any) => {
                    console.log(item['state'] === state)
                    console.log(item);
                    return item['state'] === state;
                });
            }
            return filtered;
        } catch(error) {
            console.error(error);
            return [];
        }
    }
    async activeTournamentExists() {
        if (this._activeTournamentId === undefined) return false;
        else return true;
    }
    async fetchPendingTournaments() {
        let tournaments = await this.fetchTournaments();
        console.log(tournaments);
    }
//#endregion

//#region Organizer Interactions
    async createTournament(params: TournamentParams) {
        const tournamentParams: TournamentParams = {
            name: params.name,
            tournament_type: params.tournament_type, 
            description: params.description,
            game_name: params.game_name,
            start_time: params.start_time,
            check_in_duration: params.check_in_duration,
        }
        
        const res = await axios.post('tournaments.json', tournamentParams);
            return res.data;
    }

    async abortCheckIn(tournamentId: number) {
        const res = await axios.post(`tournaments/${tournamentId}/abort_check_in.json`);
        return res.data;
    }

    async processCheckIns(tournamentId: number) {
        const res = await axios.post(`tournaments/${tournamentId}/process_check_ins.json`);
        return res.data;
    }
    async destroyTournament(id: number) {
        const res = await axios.delete(`tournaments/${id}.json`);
        return res;
    }
//#endregion
    
//#region Player Interactions
    async signup(user: {name: string}) {
    }
//#endregion
}

export class Challonge {
    static instance: PrivateChallonge;
    constructor() {
        console.error("ERROR: Use Challonge.getInstance()")
    }
    static getInstance() {
        if (!Challonge.instance) {
            Challonge.instance = new PrivateChallonge();
        }
        return Challonge.instance;
    }
}