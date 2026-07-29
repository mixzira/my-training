-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "currentSlotId" TEXT,
    "currentSince" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Routine_currentSlotId_fkey" FOREIGN KEY ("currentSlotId") REFERENCES "RoutineSlot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoutineSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routineId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "workoutId" TEXT,
    CONSTRAINT "RoutineSlot_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RoutineSlot_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExecutionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routineId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    CONSTRAINT "ExecutionLog_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExecutionLog_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "RoutineSlot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Routine_currentSlotId_key" ON "Routine"("currentSlotId");

-- CreateIndex
CREATE INDEX "RoutineSlot_routineId_idx" ON "RoutineSlot"("routineId");

-- CreateIndex
CREATE INDEX "RoutineSlot_workoutId_idx" ON "RoutineSlot"("workoutId");

-- CreateIndex
CREATE INDEX "ExecutionLog_routineId_idx" ON "ExecutionLog"("routineId");

-- CreateIndex
CREATE INDEX "ExecutionLog_slotId_idx" ON "ExecutionLog"("slotId");
