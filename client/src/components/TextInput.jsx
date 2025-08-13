export default function TextInput({ classfield, label, name, placeholder, type="text", children }){
    return(
        <div>
            <label className="block text-sm font-medium">{label}</label>
            <div className={classfield}>
                <input type={type} name={name} placeholder={placeholder} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                {children && children}
            </div>
        </div>
    );
}