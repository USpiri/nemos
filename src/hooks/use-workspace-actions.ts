import { useNavigate, useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { useCopyNote } from '@/hooks/use-copy-note'
import { useCreateFolder } from '@/hooks/use-create-folder'
import { useCreateNote } from '@/hooks/use-create-note'
import {
  getNewFolderPath,
  getNewNotePath,
  getNoteIdFromPath,
} from '@/lib/notes'
import { useDeleteFolder } from './use-delete-folder'
import { useDeleteNote } from './use-delete-note'
import { useRenameFolder } from './use-rename-folder'
import { useRenameNote } from './use-rename-note'

interface Props {
  workspace: string
}

export const useWorkspaceActions = ({ workspace }: Props) => {
  const navigate = useNavigate()
  const router = useRouter()

  const { createNote: createNoteFn } = useCreateNote({ workspace })
  const { createFolder: createFolderFn } = useCreateFolder({ workspace })
  const { copyNote: copyNoteFn } = useCopyNote({ workspace })
  const { renameNote: renameNoteFn } = useRenameNote({ workspace })
  const { renameFolder: renameFolderFn } = useRenameFolder({ workspace })
  const { deleteNote: deleteNoteFn } = useDeleteNote({ workspace })
  const { deleteFolder: deleteFolderFn } = useDeleteFolder({ workspace })

  const refreshWorkspace = useCallback(() => {
    router.invalidate({
      filter: (route) => route.id === '/workspace/$workspaceId',
    })
  }, [router.invalidate])

  const navigateToNote = useCallback(
    (noteId: string) => {
      navigate({
        to: '/workspace/$workspaceId/notes/$noteId',
        params: { workspaceId: workspace, noteId },
      })
    },
    [navigate, workspace],
  )

  const createNote = useCallback(
    async (note = '') => {
      const path = getNewNotePath(note)
      const notePath = await createNoteFn(path)
      if (!notePath) return
      return getNoteIdFromPath(notePath)
    },
    [createNoteFn],
  )

  const createFolder = useCallback(
    async (folder = '') => {
      const path = getNewFolderPath(folder)
      const folderPath = await createFolderFn(path)
      if (!folderPath) return
      return getNoteIdFromPath(folderPath)
    },
    [createFolderFn],
  )

  const copyNote = useCallback(
    async (note: string) => {
      await copyNoteFn(note, (notePath) => {
        navigateToNote(getNoteIdFromPath(notePath))
      })
    },
    [copyNoteFn, navigateToNote],
  )

  const renameNote = useCallback(
    async (note: string, newName: string) => {
      const notePath = await renameNoteFn(note, newName)
      if (!notePath) return
      return getNoteIdFromPath(notePath)
    },
    [renameNoteFn],
  )

  const renameFolder = useCallback(
    async (folder: string, newName: string) => {
      const folderPath = await renameFolderFn(folder, newName)
      if (!folderPath) return
      return getNoteIdFromPath(folderPath)
    },
    [renameFolderFn],
  )

  const deleteNote = useCallback(
    async (note: string) => {
      await deleteNoteFn(note)
    },
    [deleteNoteFn],
  )

  const deleteFolder = useCallback(
    async (folder: string) => {
      await deleteFolderFn(folder)
    },
    [deleteFolderFn],
  )

  const revealInExplorer = useCallback(() => {
    console.log('Reveal in File Explorer')
    toast.info('Reveal in File Explorer feature coming soon')
  }, [])

  const createNoteAndNavigate = useCallback(
    async (note = '') => {
      const notePath = await createNote(note)
      if (!notePath) return
      navigateToNote(notePath)
    },
    [createNote, navigateToNote],
  )

  const createFolderAndRefresh = useCallback(
    async (folder = '') => {
      const folderPath = await createFolder(folder)
      if (!folderPath) return
      refreshWorkspace()
    },
    [createFolder, refreshWorkspace],
  )

  const renameNoteAndRefresh = useCallback(
    async (note: string, newName: string) => {
      try {
        const notePath = await renameNote(note, newName)
        if (!notePath) return
      } finally {
        refreshWorkspace()
      }
    },
    [refreshWorkspace, renameNote],
  )

  const renameNoteAndNavigate = useCallback(
    async (note: string, newName: string) => {
      const notePath = await renameNote(note, newName)
      if (!notePath) return
      navigateToNote(notePath)
    },
    [navigateToNote, renameNote],
  )

  const renameFolderAndRefresh = useCallback(
    async (folder: string, newName: string) => {
      const folderPath = await renameFolder(folder, newName)
      if (!folderPath) return
      refreshWorkspace()
    },
    [refreshWorkspace, renameFolder],
  )

  const deleteNoteAndRefresh = useCallback(
    async (note: string) => {
      await deleteNote(note)
      refreshWorkspace()
    },
    [deleteNote, refreshWorkspace],
  )

  const deleteFolderAndRefresh = useCallback(
    async (folder: string) => {
      await deleteFolder(folder)
      refreshWorkspace()
    },
    [deleteFolder, refreshWorkspace],
  )

  return {
    createNote,
    createFolder,
    copyNote,
    deleteNote,
    deleteFolder,
    renameNote,
    renameFolder,
    refreshWorkspace,
    navigateToNote,
    revealInExplorer,
    createNoteAndNavigate,
    createFolderAndRefresh,
    renameNoteAndRefresh,
    renameNoteAndNavigate,
    renameFolderAndRefresh,
    deleteNoteAndRefresh,
    deleteFolderAndRefresh,
  }
}
