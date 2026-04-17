import { useNavigate, useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'
import {
  newFolderRelativePath,
  newNoteRelativePath,
  toRelativePath,
} from '@/lib/paths'
import { useCopyNote } from './use-copy-note'
import { useCreateFolder } from './use-create-folder'
import { useCreateNote } from './use-create-note'
import { useDeleteFolder } from './use-delete-folder'
import { useDeleteNote } from './use-delete-note'
import { useMoveFolder } from './use-move-folder'
import { useMoveNote } from './use-move-note'
import { useOpenInExplorer } from './use-open-in-explorer'
import { useRenameFolder } from './use-rename-folder'
import { useRenameNote } from './use-rename-note'

interface Props {
  workspace: string
}

export const useWorkspaceActions = ({ workspace }: Props) => {
  const navigate = useNavigate()
  const router = useRouter()

  const { createNote: createNoteFn } = useCreateNote({ workspaceId: workspace })
  const { createFolder: createFolderFn } = useCreateFolder({
    workspaceId: workspace,
  })
  const { copyNote: copyNoteFn } = useCopyNote({ workspaceId: workspace })
  const { renameNote: renameNoteFn } = useRenameNote({ workspaceId: workspace })
  const { renameFolder: renameFolderFn } = useRenameFolder({
    workspaceId: workspace,
  })
  const { moveNote: moveNoteFn } = useMoveNote({ workspaceId: workspace })
  const { moveFolder: moveFolderFn } = useMoveFolder({ workspaceId: workspace })
  const { deleteNote: deleteNoteFn } = useDeleteNote({ workspaceId: workspace })
  const { deleteFolder: deleteFolderFn } = useDeleteFolder({
    workspaceId: workspace,
  })
  const { openInExplorer } = useOpenInExplorer()

  const refreshWorkspace = useCallback(() => {
    router.invalidate({
      filter: (route) => route.id === '/workspace/$workspaceId',
    })
  }, [router.invalidate])

  const navigateToNote = useCallback(
    (relativeNotePath: string) => {
      navigate({
        to: '/workspace/$workspaceId/notes/$noteId',
        params: { workspaceId: workspace, noteId: relativeNotePath },
      })
    },
    [navigate, workspace],
  )

  const createNote = useCallback(
    async (note = '') => {
      const relativePath = newNoteRelativePath(note)
      const noteFsPath = await createNoteFn(relativePath)
      if (!noteFsPath) return
      return toRelativePath(noteFsPath)
    },
    [createNoteFn],
  )

  const createFolder = useCallback(
    async (folder = '') => {
      const relativePath = newFolderRelativePath(folder)
      const folderFsPath = await createFolderFn(relativePath)
      if (!folderFsPath) return
      return toRelativePath(folderFsPath)
    },
    [createFolderFn],
  )

  const copyNote = useCallback(
    async (relativeNotePath: string) => {
      await copyNoteFn(relativeNotePath, (noteFsPath) => {
        navigateToNote(toRelativePath(noteFsPath))
      })
    },
    [copyNoteFn, navigateToNote],
  )

  const renameNote = useCallback(
    async (relativeNotePath: string, newName: string) => {
      const noteFsPath = await renameNoteFn(relativeNotePath, newName)
      if (!noteFsPath) return
      return toRelativePath(noteFsPath)
    },
    [renameNoteFn],
  )

  const renameFolder = useCallback(
    async (relativeFolderPath: string, newName: string) => {
      const folderFsPath = await renameFolderFn(relativeFolderPath, newName)
      if (!folderFsPath) return
      return toRelativePath(folderFsPath)
    },
    [renameFolderFn],
  )

  const moveNote = useCallback(
    async (relativeNotePath: string, destination: string) => {
      const noteFsPath = await moveNoteFn(relativeNotePath, destination)
      if (!noteFsPath) return
      return toRelativePath(noteFsPath)
    },
    [moveNoteFn],
  )

  const moveFolder = useCallback(
    async (relativeFolderPath: string, destination: string) => {
      const folderFsPath = await moveFolderFn(relativeFolderPath, destination)
      if (!folderFsPath) return
      return toRelativePath(folderFsPath)
    },
    [moveFolderFn],
  )

  const deleteNote = useCallback(deleteNoteFn, [])

  const deleteFolder = useCallback(
    async (relativeFolderPath: string) => {
      await deleteFolderFn(relativeFolderPath)
    },
    [deleteFolderFn],
  )

  const revealInExplorer = useCallback(
    async (relativeNotePath?: string) => {
      await openInExplorer({ workspace, note: relativeNotePath })
    },
    [openInExplorer, workspace],
  )

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
    async (relativeNotePath: string, newName: string) => {
      try {
        const notePath = await renameNote(relativeNotePath, newName)
        if (!notePath) return
      } finally {
        refreshWorkspace()
      }
    },
    [refreshWorkspace, renameNote],
  )

  const renameNoteAndNavigate = useCallback(
    async (relativeNotePath: string, newName: string) => {
      const notePath = await renameNote(relativeNotePath, newName)
      if (!notePath) return
      navigateToNote(notePath)
    },
    [navigateToNote, renameNote],
  )

  const renameFolderAndRefresh = useCallback(
    async (relativeFolderPath: string, newName: string) => {
      const folderPath = await renameFolder(relativeFolderPath, newName)
      if (!folderPath) return
      refreshWorkspace()
    },
    [refreshWorkspace, renameFolder],
  )

  const moveNoteAndRefresh = useCallback(
    async (relativeNotePath: string, destination: string) => {
      const notePath = await moveNote(relativeNotePath, destination)
      if (!notePath) return
      refreshWorkspace()
    },
    [moveNote, refreshWorkspace],
  )

  const moveFolderAndRefresh = useCallback(
    async (relativeFolderPath: string, destination: string) => {
      const folderPath = await moveFolder(relativeFolderPath, destination)
      if (!folderPath) return
      refreshWorkspace()
    },
    [moveFolder, refreshWorkspace],
  )

  const deleteNoteAndRefresh = useCallback(
    async (relativeNotePath: string) => {
      await deleteNoteFn(relativeNotePath, {
        onSuccess: refreshWorkspace,
      })
    },
    [deleteNoteFn, refreshWorkspace],
  )

  const deleteFolderAndRefresh = useCallback(
    async (relativeFolderPath: string) => {
      await deleteFolderFn(relativeFolderPath, {
        onSuccess: refreshWorkspace,
      })
    },
    [deleteFolderFn, refreshWorkspace],
  )

  return {
    createNote,
    createFolder,
    copyNote,
    deleteNote,
    deleteFolder,
    renameNote,
    renameFolder,
    moveNote,
    moveFolder,
    refreshWorkspace,
    navigateToNote,
    revealInExplorer,
    createNoteAndNavigate,
    createFolderAndRefresh,
    renameNoteAndRefresh,
    renameNoteAndNavigate,
    renameFolderAndRefresh,
    moveNoteAndRefresh,
    moveFolderAndRefresh,
    deleteNoteAndRefresh,
    deleteFolderAndRefresh,
  }
}
