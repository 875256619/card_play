import { API_URL } from './config';

export const fetchGameData = async () => {
    const response = await fetch(`${API_URL}/api/game`);
    return response.json();
};