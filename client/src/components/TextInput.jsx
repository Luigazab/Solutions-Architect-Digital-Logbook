export default function TextInput({label, name, placeholder, type= "text"}){
    return(
        <div>
            <label className="block text-sm font-medium">{label}</label>
            <input type={type} name={name} placeholder={placeholder} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
    );
}