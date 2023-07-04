import axios from 'axios';
import { ParticipantData, RegistrationParams, TournamentData, TournamentParams } from '../types';

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
    async fetchTournaments(state?: string[]): Promise<TournamentData[]> {
        try {
            const res = await axios.get('tournaments.json')
            let filtered = res.data;
            filtered = filtered.map((item: any) => {
                const tournament = item.tournament;
                return TournamentResponseToData(tournament);
            })
            if (state) {
                filtered = filtered.filter((item: any) => {
                    return state.includes(item['state']);
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
            return TournamentResponseToData(tournament)
        } catch(err) {
            console.error(err);
            return undefined
        }
    }

    activeTournamentExists(): boolean {
        if (this._activeTournamentId === undefined) return false;
        else return true;
    }

    async fetchParticipants(): Promise<ParticipantData[]> {
        try {
            const res = await axios.get(`tournaments/${this._activeTournamentId}/participants.json`)
            const out: ParticipantData[] = []
            res.data.forEach((item: any) => {
                const participantData = ParticipantResponseToData(item.participant)
                out.push(participantData)
            })
            return out;
        } catch(err) {
            console.error(err);
            return [];
        }
    }
//#endregion

//#region Organizer Interactions
    async createTournament(params: TournamentParams): Promise<TournamentData | undefined> {
        const tournamentParams: TournamentParams = {
            name: params.name,
            tournament_type: params.tournament_type, 
            description: params.description,
            game_name: params.game_name,
            start_time: params.start_time,
            check_in_duration: params.check_in_duration,
        }

        const res = await axios.post('tournaments.json', tournamentParams);
        const out = {
            id: res.data['id'],
            name: res.data['name'],
            tournament_type: res.data['tournament_type'],
            description: res.data['description'],
            signup_cap: res.data['signup_cap'],
            open_signup: res.data['open_signup'],
            state: res.data['state'],
            url: res.data['url'],
            full_challonge_url: res.data['full_challonge_url'],
            live_image_url: res.data['live_image_url'],
            game_name: res.data['game_name'],
            progress_meter: res.data['progress_meter'],
        }
        return out;
    }

    async startTournament() {
        if (!this.activeTournamentExists()) {
            return { status: 500, data: { errors: "No Active Tournament" }}
        } else {
            const params = {
                include_matches: 1,
                include_participants: 1,
            }
            const res = await axios.post(`tournaments/${this._activeTournamentId}/start.json`, params);
            return res
        }
    }

    async resetTournament() {
        if (!this.activeTournamentExists()) {
            return { status: 500, data: { errors: "No Active Tournament" }}
        } else {
            const res = await axios.post(`tournaments/${this._activeTournamentId}/reset.json`);
            return res
        }
    }

    async messageParticipants(message: string) {
        const participants = await this.fetchParticipants();
        console.log(participants);
        participants.forEach(participant => {
            if (participant['discord_id'] !== undefined) {

            }
        })
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

//#endregion
    
//#region Player Interactions
    // Sign up a user for the active tournament.
    //   misc -> Misc field used to match discord ids to userlist
    async register(params: RegistrationParams): Promise<{status: number, data: object}> {
        if (!this.activeTournamentExists()) {
            const data: object = { errors: 'No Active Tournament' }
            return {status: 500, data: data}
        }
        try {
            const miscObj = JSON.parse(params['misc']);
            if (await this.isPlayerRegistered(Number(miscObj['discord_id']))) {
                const data: object = { errors: "Player is already registered" }
                return { status: 200, data: data}
            } else {
                const res = await axios.post(`tournaments/${this._activeTournamentId}/participants.json`, params);
                return { status: 200, data: res.data };
            }
        } catch(err) {
            console.error(err);
            const data: object = {errors: err}
            return {status: 500, data: data}
        }
    }

    async isPlayerRegistered(id: number): Promise<boolean> {
        try {
            const participants = await this.fetchParticipants();
            const discord_ids: number[] = participants.map(participant => {
                return Number(participant['discord_id']);
            });
            return discord_ids.includes(id);
        } catch (err) {
            console.error(err);
            return false;
        }
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

function TournamentResponseToData(tournament: any) : TournamentData {
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
}

function ParticipantResponseToData(participant: any) : ParticipantData {
    let out: ParticipantData = {
        id: Number(participant['id']),
        tournament_id: Number(participant['tournament_id']),
        name: String(participant['name']),
        seed: Number(participant['seed']),
    }
    
    const miscJSON = JSON.parse(participant['misc'])
    if (miscJSON !== null && miscJSON['discord_id'] !== null) {
        out['discord_id'] = miscJSON['discord_id']
    }

    return out;
}