import { createSlice } from '@reduxjs/toolkit';
import { getStoredTheme, setStoredTheme } from '../../utils/storage';

const initialTheme = getStoredTheme();

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: initialTheme === 'dark',
    sidebarOpen: true,
    mobileMenuOpen: false,
    activeModal: null,
    modalData: null,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      const theme = state.darkMode ? 'dark' : 'light';
      setStoredTheme(theme);
      document.documentElement.setAttribute('data-theme', theme);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload.modal;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
  },
});

export const {
  toggleDarkMode,
  toggleSidebar,
  toggleMobileMenu,
  closeMobileMenu,
  openModal,
  closeModal,
} = uiSlice.actions;

export const selectDarkMode = (state) => state.ui.darkMode;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;

export default uiSlice.reducer;
