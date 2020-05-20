import exportZipArchive from '../../utils/export';

import actions from '../actions';

import * as S from '../';

export const middleware: S.Middleware = ({ dispatch, getState }) => {
  window.electron.receive('appCommand', (command) => {
    switch (command.action) {
      case 'exportZipArchive':
        exportZipArchive();
        return;

      case 'printNote':
        window.print();
        return;

      case 'activateTheme':
        dispatch(actions.settings.activateTheme(command.theme));
        return;

      case 'focusSearchField':
        dispatch(actions.ui.focusSearchField());
        return;

      case 'insertChecklist':
        dispatch({ type: 'INSERT_TASK' });
        return;

      case 'showDialog':
        dispatch(actions.ui.showDialog(command.dialog));
        return;

      case 'trashNote':
        dispatch(actions.ui.trashOpenNote());
        return;

      case 'newNote':
        dispatch(actions.ui.createNote());
        return;

      case 'increaseFontSize':
        dispatch(actions.settings.increaseFontSize());
        return;

      case 'decreaseFontSize':
        dispatch(actions.settings.decreaseFontSize());
        return;

      case 'resetFontSize':
        dispatch(actions.settings.resetFontSize());
        return;

      case 'setNoteDisplay':
        dispatch(actions.settings.setNoteDisplay(command.noteDisplay));
        return;

      case 'toggleSpellCheck':
        dispatch(actions.settings.toggleSpellCheck());
        return;

      default:
        console.log(command);
    }
  });

  window.electron.send('settingsUpdate', getState().settings);

  return (next) => (action) => {
    const prevState = getState();
    const result = next(action);
    const nextState = getState();

    if (prevState.settings !== nextState.settings) {
      window.electron.send('settingsUpdate', nextState.settings);
    }

    return result;
  };
};

export default middleware;