import { useNavigate, useParams, useRouter } from '@tanstack/react-router'
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
  root: string
}

export const useRootActions = ({ root }: Props) => {
  const navigate = useNavigate()
  const router = useRouter()
  // Route/session identity is the Root's absolute path (#84); `root`
  // above is the bare folder name used by the fs-mutation hooks below.
  const { rootPath } = useParams({ strict: false })

  const { createNote: createNoteFn } = useCreateNote({ workspaceId: root })
  const { createFolder: createFolderFn } = useCreateFolder({
    workspaceId: root,
  })
  const { copyNote: copyNoteFn } = useCopyNote({ workspaceId: root })
  const { renameNote: renameNoteFn } = useRenameNote({ workspaceId: root })
  const { renameFolder: renameFolderFn } = useRenameFolder({
    workspaceId: root,
  })
  const { moveNote: moveNoteFn } = useMoveNote({ workspaceId: root })
  const { moveFolder: moveFolderFn } = useMoveFolder({ workspaceId: root })
  const { deleteNote: deleteNoteFn } = useDeleteNote({ workspaceId: root })
  const { deleteFolder: deleteFolderFn } = useDeleteFolder({
    workspaceId: root,
  })
  const { openInExplorer } = useOpenInExplorer()

  const refreshRoot = useCallback(() => {
    router.invalidate({
      filter: (route) => route.id === '/workspace/$rootPath',
    })
  }, [router.invalidate])

  const navigateToNote = useCallback(
    (relativeNotePath: string) => {
      navigate({
        to: '/workspace/$rootPath/notes/$noteId',
        params: { rootPath: rootPath!, noteId: relativeNotePath },
      })
    },
    [navigate, rootPath],
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
      await openInExplorer({ workspace: root, note: relativeNotePath })
    },
    [openInExplorer, root],
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
      refreshRoot()
    },
    [createFolder, refreshRoot],
  )

  const renameNoteAndRefresh = useCallback(
    async (relativeNotePath: string, newName: string) => {
      try {
        const notePath = await renameNote(relativeNotePath, newName)
        if (!notePath) return
      } finally {
        refreshRoot()
      }
    },
    [refreshRoot, renameNote],
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
      refreshRoot()
    },
    [refreshRoot, renameFolder],
  )

  const moveNoteAndRefresh = useCallback(
    async (relativeNotePath: string, destination: string) => {
      const notePath = await moveNote(relativeNotePath, destination)
      if (!notePath) return
      refreshRoot()
    },
    [moveNote, refreshRoot],
  )

  const moveFolderAndRefresh = useCallback(
    async (relativeFolderPath: string, destination: string) => {
      const folderPath = await moveFolder(relativeFolderPath, destination)
      if (!folderPath) return
      refreshRoot()
    },
    [moveFolder, refreshRoot],
  )

  const deleteNoteAndRefresh = useCallback(
    async (relativeNotePath: string) => {
      await deleteNoteFn(relativeNotePath, {
        onSuccess: refreshRoot,
      })
    },
    [deleteNoteFn, refreshRoot],
  )

  const deleteFolderAndRefresh = useCallback(
    async (relativeFolderPath: string) => {
      await deleteFolderFn(relativeFolderPath, {
        onSuccess: refreshRoot,
      })
    },
    [deleteFolderFn, refreshRoot],
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
    refreshRoot,
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
