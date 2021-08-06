export function setState(state: any, payload: any): void {
  for (const [key, value] of Object.entries(state)) {
    if (payload[key]) {
      state[key] = payload[key];
    }
  }
}
