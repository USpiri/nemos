import { useNavigate, useParams, useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'
import {
  newFolderRelativePath,
  newNoteRelativePath,
  toFsPath,
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

export const useRootActions = () => {
  const navigate = useNavigate()
  const router = useRouter()
  // Route/session identity is the Root's absolute path (#84), and — per
  // #85 — also its fs identity: a Root can live anywhere on disk, so its
  // absolute path is what the fs-mutation hooks below key off of.
  const { rootPath } = useParams({ strict: false })
  // Every caller of this hook lives under /workspace/$rootPath/*, so this is
  // always defined at runtime despite the `strict: false` param type above.
  const root = rootPath!

  const { createNote: createNoteFn } = useCreateNote({ rootPath: root })
  const { createFolder: createFolderFn } = useCreateFolder({
    rootPath: root,
  })
  const { copyNote: copyNoteFn } = useCopyNote({ rootPath: root })
  const { renameNote: renameNoteFn } = useRenameNote({ rootPath: root })
  const { renameFolder: renameFolderFn } = useRenameFolder({
    rootPath: root,
  })
  const { moveNote: moveNoteFn } = useMoveNote({ rootPath: root })
  const { moveFolder: moveFolderFn } = useMoveFolder({ rootPath: root })
  const { deleteNote: deleteNoteFn } = useDeleteNote({ rootPath: root })
  const { deleteFolder: deleteFolderFn } = useDeleteFolder({
    rootPath: root,
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
        params: { rootPath: root, noteId: relativeNotePath },
      })
    },
    [navigate, root],
  )

  const createNote = useCallback(
    async (note = '') => {
      const relativePath = newNoteRelativePath(note)
      const noteFsPath = await createNoteFn(relativePath)
      if (!noteFsPath) return
      return toRelativePath(noteFsPath, root)
    },
    [createNoteFn, root],
  )

  const createFolder = useCallback(
    async (folder = '') => {
      const relativePath = newFolderRelativePath(folder)
      const folderFsPath = await createFolderFn(relativePath)
      if (!folderFsPath) return
      return toRelativePath(folderFsPath, root)
    },
    [createFolderFn, root],
  )

  const copyNote = useCallback(
    async (relativeNotePath: string) => {
      await copyNoteFn(relativeNotePath, (noteFsPath) => {
        navigateToNote(toRelativePath(noteFsPath, root))
      })
    },
    [copyNoteFn, navigateToNote, root],
  )

  const renameNote = useCallback(
    async (relativeNotePath: string, newName: string) => {
      const noteFsPath = await renameNoteFn(relativeNotePath, newName)
      if (!noteFsPath) return
      return toRelativePath(noteFsPath, root)
    },
    [renameNoteFn, root],
  )

  const renameFolder = useCallback(
    async (relativeFolderPath: string, newName: string) => {
      const folderFsPath = await renameFolderFn(relativeFolderPath, newName)
      if (!folderFsPath) return
      return toRelativePath(folderFsPath, root)
    },
    [renameFolderFn, root],
  )

  const moveNote = useCallback(
    async (relativeNotePath: string, destination: string) => {
      const noteFsPath = await moveNoteFn(relativeNotePath, destination)
      if (!noteFsPath) return
      return toRelativePath(noteFsPath, root)
    },
    [moveNoteFn, root],
  )

  const moveFolder = useCallback(
    async (relativeFolderPath: string, destination: string) => {
      const folderFsPath = await moveFolderFn(relativeFolderPath, destination)
      if (!folderFsPath) return
      return toRelativePath(folderFsPath, root)
    },
    [moveFolderFn, root],
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
      const path = relativeNotePath ? toFsPath(root, relativeNotePath) : root
      await openInExplorer(path)
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
