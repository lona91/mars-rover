/**
 * @description Interfaccia per la risposta di un comando
 */
export default interface ICommandResponse {
  /**
   * @description Funzione per l'annullamento del comando
   */
  undo: Function;
  /**
   * @description Nome della funzione da visualizzare nella storia
   */
  name: string;
}
