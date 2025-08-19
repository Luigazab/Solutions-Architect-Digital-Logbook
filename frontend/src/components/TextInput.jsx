export default function TextInput({ classfield, label,id, name, value, onChange, placeholder, type="text", children, minlength, required=false }){
    return(
        <div>
            <label htmlFor={id} className="block text-sm font-medium">{label}</label>
            <div className={classfield}>
                <input id={id} type={type} name={name} value={value} minLength={minlength} onChange={onChange} placeholder={placeholder} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required={required} />
                {children && children}
            </div>
        </div>
    );
}