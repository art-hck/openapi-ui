import { Reference, Schema } from "./swagger-schema-offcial";
import { isRef } from "../services/is-ref";

export class SchemaTree<T = Schema | Reference | undefined> {
  private parent?: SchemaTree;

  constructor(public readonly payload: T) {
  }

  setParent(parent: SchemaTree) {
    this.parent = parent;
  }

  isRecursive(): false | SchemaTree<Reference> {
    let parent = this.parent;
    let refs: string[] = [];

    while (parent) {
      if (SchemaTree.isTreeWithRef(parent)) {
        if (refs.includes(parent.payload.$ref)) {
          return parent as SchemaTree<Reference>;
        }

        refs.push(parent.payload.$ref);
      }

      parent = parent.parent;
    }

    return false;
  }

  private static isTreeWithRef(tree: SchemaTree): tree is SchemaTree<Reference> {
    return isRef(tree.payload);
  }
}
