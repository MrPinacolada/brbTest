import { Card } from "@/modules/board/models/card";

class DragManager {
  private draggedCard: Card | null = null;
  private sourceColumnId: string | null = null;

  startDragging(card: Card, columnId: string) {
    this.draggedCard = card;
    this.sourceColumnId = columnId;
  }

  getDraggedCard() {
    return this.draggedCard;
  }

  getSourceColumnId() {
    return this.sourceColumnId;
  }

  reset() {
    this.draggedCard = null;
    this.sourceColumnId = null;
  }
}

export const dragManager = new DragManager();
