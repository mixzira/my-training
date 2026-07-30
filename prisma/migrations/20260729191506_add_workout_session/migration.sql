-- CreateTable
CREATE TABLE "WorkoutSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "workoutId" TEXT NOT NULL,
    "completedAt" DATETIME,
    "photoKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkoutSession_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SessionEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "weight" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "SessionEntry_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SessionEntry_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSession_date_key" ON "WorkoutSession"("date");

-- CreateIndex
CREATE INDEX "WorkoutSession_workoutId_idx" ON "WorkoutSession"("workoutId");

-- CreateIndex
CREATE INDEX "SessionEntry_sessionId_idx" ON "SessionEntry"("sessionId");

-- CreateIndex
CREATE INDEX "SessionEntry_exerciseId_idx" ON "SessionEntry"("exerciseId");
