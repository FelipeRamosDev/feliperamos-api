import TableRow from '../../../../services/Database/models/TableRow';
import { CommentSetup } from './Comment.types';

export default class Comment extends TableRow {
   public content: string;
   public author_id: number;

   constructor (setup: CommentSetup) {
      super('comments_schema', 'comments', setup);
      const { content, author_id } = setup;

      this.content = content;
      this.author_id = author_id;
   }
}
