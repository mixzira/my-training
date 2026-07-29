-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Routine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentSlotId" TEXT,
    "currentSince" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Routine_currentSlotId_fkey" FOREIGN KEY ("currentSlotId") REFERENCES "RoutineSlot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Routine" ("createdAt", "currentSince", "currentSlotId", "id", "name", "updatedAt") SELECT "createdAt", "currentSince", "currentSlotId", "id", "name", "updatedAt" FROM "Routine";
DROP TABLE "Routine";
ALTER TABLE "new_Routine" RENAME TO "Routine";
CREATE UNIQUE INDEX "Routine_currentSlotId_key" ON "Routine"("currentSlotId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
