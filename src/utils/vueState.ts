export function setState(state: any, payload: any): void {
  for (const [key, value] of Object.entries(state)) {
    if (payload[key] != undefined) {
      state[key] = payload[key];
    }
  }
}
