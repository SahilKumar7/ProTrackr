import Input from "./Input";

export default function NewProject () {
    return (
        <div>
            <menu>
                <li><button>Cancel</button></li>
                <li><button>Save</button></li>
            </menu>
            <div>
                <Input label={"Title"} type="text" />
                <Input label={"Description"} isTextArea />
                <Input label={"Due Date"} type="text" />
            </div>
        </div>
    );
}