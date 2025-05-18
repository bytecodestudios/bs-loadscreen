import { create } from 'zustand'

export const useVisibility = create<{ visible: boolean; setVisible: (value: boolean) => void }>((set) => ({
	visible: true,
	setVisible: (value: boolean) => set({ visible: value }),
}))