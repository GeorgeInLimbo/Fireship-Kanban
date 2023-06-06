import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  arrayRemove,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { Board, Task } from './board.model';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  // constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}
  private readonly _auth = inject(Auth);
  private readonly _firestore = inject(Firestore);

  createBoard(board: Board) {
    const user = this._auth.currentUser;
    const collectionRef = collection(this._firestore, 'boards');
    const data = {
      ...board,
      uid: user?.uid,
      tasks: [{ description: 'Hello!', label: 'yellow' }],
    };

    return addDoc(collectionRef, data);
  }

  deleteBoard(boardId: string) {
    const docReference = doc(this._firestore, 'boards', boardId);
    return deleteDoc(docReference);
  }

  updateTasks(boardId: string, tasks: Task[]) {
    const docRef = doc(this._firestore, 'boards', boardId);
    const data = { tasks };
    return updateDoc(docRef, data);
  }

  removeTask(boardId: string, task: Task) {
    return updateDoc(doc(this._firestore, 'boards', boardId), {
      tasks: arrayRemove(task),
    });
  }

  getUserBoards() {
    return authState(this._auth).pipe(
      // Return an observable of an auth state
      switchMap((user) => {
        // Returns an observable of data instead of auth user
        if (user) {
          return collectionData(
            query(
              collection(this._firestore, 'boards'),
              where('uid', '==', user.uid),
              orderBy('priority') // if the user isn't falsy, we provide some data for the user
            ),
            { idField: 'id' }
          );
        } else {
          return []; // If user is falsy, return fuckin nothin
        }
      })
    );
  }

  sortBoards(boards: Board[]) {
    const batch = writeBatch(this._firestore);
    const refs = boards
      .filter((b) => !!b.id)
      .map((b) => doc(this._firestore, 'boards', b.id!));
    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }
}
