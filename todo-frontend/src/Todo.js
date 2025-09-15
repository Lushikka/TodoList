import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    // edit
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiurl = "http://localhost:4000";

    const handleSubmit = () => {
        setError("");
        if (title.trim() !== "" && description.trim() !== "") {
            fetch(apiurl + "/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }]);
                    setMessage("Item added successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                } else {
                    setError("Failed to add todo item");
                }
            });
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiurl + "/todos")
            .then((res) => res.json())
            .then((res) => setTodos(res));
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            fetch(apiurl + "/todos/" + editId, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: editTitle, description: editDescription }),
            }).then((res) => {
                if (res.ok) {
                    const updatedTodos = todos.map((item) => {
                        if (item._id === editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    });
                    setTodos(updatedTodos);
                    setMessage("Item updated successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                    setEditId(-1);
                } else {
                    setError("Failed to update todo item");
                }
            });
        }
    };

    const handleEditCancel = () => {
        setEditId(-1);
        setEditTitle("");
        setEditDescription("");
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            fetch(apiurl + "/todos/" + id, {
                method: "DELETE",
            }).then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setMessage("Item deleted successfully");
                setTodos(updatedTodos);
                setTimeout(() => {
                    setMessage("");
                }, 3000);   
            });
        }
    }; 

    return (
        <>
            <div className="row-p-3 mb-2 bg-secondary text-light text-center">
                <h1>ToDo Projects with MERN stack</h1>
            </div>
            <div className="row">
                <h3>Add item</h3>
                {message && <p className="text-success">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                        type="text"
                    />
                    <input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-control"
                        type="text"
                    />
                    <button className="btn btn-dark" onClick={handleSubmit}>
                        submit
                    </button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>
            <div className="row mt-3">
                <h3>Tasks</h3>
                <div className="col-md-6">
                           <ul className="list-group">
                    {todos.map((item) => (
                        <li
                            key={item._id}
                            className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
                        >
                            <div className="d-flex flex-column me-2">
                                {editId === -1 || editId !== item._id ? (
                                    <>
                                        <span className="fw-bold">{item.title}</span>
                                        <span>{item.description}</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="form-group d-flex gap-2">
                                            <input
                                                placeholder="Title"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="form-control"
                                                type="text"
                                            />
                                            <input
                                                placeholder="Description"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                className="form-control"
                                                type="text"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="d-flex gap-2">
                                {editId === -1 || editId !== item._id ? (
                                    <button className="btn btn-warning" onClick={() => handleEdit(item)}>
                                        Edit
                                    </button>
                                ) : (
                                    <button onClick={handleUpdate}>Update</button>
                                )}
                                {editId === -1 ? (
                                    <button
                                        className="btn btn-danger btn-sm float-end"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-danger btn-sm float-end"
                                        onClick={handleEditCancel}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                </div>
                
            </div>
        </>
    );
}
