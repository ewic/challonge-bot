import axios from 'axios';
import { color } from "../functions";
import { Participant, TournamentData, TournamentParams } from '../types';

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

    private _participantRecord: Participant[] = []
    get participantRecord(): Participant[] {
        return this._participantRecord;
    }
    set participantRecord(value: Participant[]) {
        this._participantRecord = value;
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
                    return item['state'] === state;
                });
            }
            return filtered;
        } catch(error) {
            console.error(error);
            return [];
        }
    }

    async fetchTournament(id: number): Promise<TournamentData | undefined> {
        try {
            const res = await axios.get(`tournaments/${id}.json`)
            const tournament = res.data.tournament
            return {
                id: tournament['id'],
                name: tournament['name'],
                tournament_type: tournament['tournament_type'],
                description: tournament['description'],
                signup_cap: tournament['signup_cap'],
                open_signup: tournament['open_signup'],
                state: tournament['state'],
                url: tournament['url'],
                progress_meter: tournament['progress_meter'],
                full_challonge_url: tournament['full_challonge_url'],
                live_image_url: tournament['live_image_url'],
                game_name: tournament['game_name'],
            }
        } catch(err) {
            console.error(err);
            return undefined
        }
    }

    async activeTournamentExists() {
        if (this._activeTournamentId === undefined) return false;
        else return true;
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

    unsetActiveTournamentId() {
        this._activeTournamentId = undefined;
        return true;
    }

    // Test this...
    addParticipantToRecord(participant: Participant) {
        return this._participantRecord.push(participant);
    }
//#endregion
    
//#region Player Interactions
    // Sign up a user for the active tournament.
    //   misc -> Misc field used to match discord ids to userlist
    async signup(tag: string, misc: string, challonge_username?: string) {
        if (!this.activeTournamentExists()) return {status: 500, error: 'No Active Tournament'};
        const params = {
            name: tag,
            challonge_username: challonge_username,
            misc: misc
        }
        const res = await axios.post(`tournaments/${this._activeTournamentId}/participants.json`, params);
        console.log(res);
        return {status: 200, error: ''};
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