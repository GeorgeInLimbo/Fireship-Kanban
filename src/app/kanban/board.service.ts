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
    authState(this._auth).pipe(
      switchMap((user) => {
        if (user) {
          return collectionData(
            query(
              collection(this._firestore, 'boards'),
              where('uid', '==', user.uid),
              orderBy('priority')
            ),
            { idField: 'id' }
          );
        } else {
          return [];
        }
      })
    );
  }

  // getUserBoards() {
  //   return this.afAuth.authState.pipe(
  //     switchMap((user) => {
  //       if (user) {
  //         return this.db
  //           .collection<Board>('boards', (ref) =>
  //             ref.where('uid', '==', user.uid).orderBy('priority')
  //           )
  //           .valueChanges({ idField: 'id' });
  //       } else {
  //         return [];
  //       }
  //     })
  //   );
  // }
}
