export default function TextArea({label, name, value, onChange, placeholder, disabled=false }){
    return(
        <div>
            <label className="block text-sm font-medium">{label}</label>
            <textarea className="mt-1 block w-full border border-gray-300 rounded-md p-2" name={name} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}></textarea>
        </div>
    );
}