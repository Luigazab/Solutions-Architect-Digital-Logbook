export default function TextArea({label, name, placeholder}){
    return(
        <div>
            <label className="block text-sm font-medium">{label}</label>
            <textarea className="mt-1 block w-full border border-gray-300 rounded-md p-2" name={name} placeholder={placeholder}></textarea>
        </div>
    );
}