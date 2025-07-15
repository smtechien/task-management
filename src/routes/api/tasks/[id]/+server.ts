import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tasks } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

//PUT:ID - Update task
export async function PUT({ params, request}) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return json({ message: 'Invalid task ID'}, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, description, completed } = body;

    if (typeof completed !== 'boolean') {
      return json({ message: 'Invalid value for completed'}, { status: 400 });
    }

    const [updatedTask] = await db.update(tasks) // [updatedTask] array destructuring
      .set({ title, description, completed, updatedAt: new Date()})
      .where(eq(tasks.id, id))
      .returning(); // get the updated task

    // check if any task get updated
    if (!updatedTask) {
      return json({ message: 'Task not found' }, { status: 404 });
    }
    return json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(`Error patching task ${id}`, error);
    return json({ message: 'Failed to update task' }, { status: 500 });
  }
}


// PATCH:ID - Update task's status of completion
export async function PATCH({ params, request }) {
  // parsing id into integer
  const id = parseInt(params.id);

  // make sure id is number
  if (isNaN(id)) {
    return json({ message: 'Invalid task ID'}, { status: 400 });
  }

  // try-catch to handling update action
  try {
    // get value from completed field
    const body = await request.json();
    const { completed } = body;

    // make sure var completed is boolean
    if (typeof completed !== 'boolean') {
      return json({ message: 'Invalid value for completed'}, { status: 400 });
    }

    // update the task by id
    const [updatedTask] = await db.update(tasks) // [updatedTask] array destructuring
      .set({ completed, updatedAt: new Date()})
      .where(eq(tasks.id, id))
      .returning(); // get the updated task

    // check if any task get updated
    if (!updatedTask) {
      return json({ message: 'Task not found' }, { status: 404 });
    }

    // returning the updatedTask and status code
    return json(updatedTask, { status: 200 });
  } catch (error) {
      //handling any error that might happen while updating the task
      console.error(`Error patching task ${id}`, error);
      return json({ message: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE:ID - delete task by id
export async function DELETE({ params }) {
  // parse id into integer
  const id = parseInt(params.id);

  // check if id type is not number
  if (isNaN(id)) {
    return json({ message: 'Invalid task ID'}, { status: 400 });
  }

  // try catch to try and handling error on delete function
  try {
    
    // delete task by id
    const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();

    // check if the result is 0 (no task get deleted)
    if (result.length === 0 ) {
      return json({ message: 'Task not found' }, { status: 400 });
    }

    // returning success code
    return new Response(null, { status: 204 });

  } catch (error) {

    //handling any error that might happens while deleting a task
    console.error(`Erorr deleting task ${id}: `, error);
    return json({ message: 'Failed to delete task'}, { status: 500 });
  }
}

