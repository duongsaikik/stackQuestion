
import React, { useState } from "react";
import styles from './tagInput.module.css'



import { publicFetch } from "../../util/fetcher";

const TagInput = ({ selectedTags, inputInfo, label, errorMessage,value }) => {

	const [tag, setTags] = useState(value? value : []);
	const [itemTag, setItemTag] = useState(null);
	const [search, setSearch] = useState('');
	const [err,setErr] = useState(errorMessage);

	
	
	const removeTags = (indexToRemove) => {
		setTags([...tag.filter((_, index) => index !== indexToRemove)]);
		selectedTags([...tag.filter((_, index) => index !== indexToRemove)]);
	};

	const removeAccents = (str) => {
		return str.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd').replace(/Đ/g, 'D')
			.toLowerCase();
	}

	const existsTg = (v) =>{
		return tag.find((x) => x === v) === v;
	}

	const addTags = event => {
		if (event.target.value !== "" && event.target.value !== " ") {
				if(event.target.value.lenth > 10){
					setErr("Độ dài của tag vượt quá 10");
				}else{
					const receive = event.target.value;
					const t = receive.replace(/\s/g,"");
					if (existsTg(t)) {
						console.log(1)
						setErr("Tag đã tồn tại trong danh sách");
						setItemTag(null)
					} else {
						setTags([...tag, removeAccents(t)]);
						selectedTags([...tag, removeAccents(t)]);
						event.target.value = "";
						setSearch('')
						setItemTag(null)
						setErr(null);
					}
				}
				
			
		}else{
			setSearch('')
		}
	};
	const handlerShow = async (e) => {
		if(e.target.value.length > 10){
			setErr("Độ dài của tag vượt quá 10");
		}else{
			setSearch(e.target.value)
			var request = {
				params: {
					page: 1,
					size: 30
				}
			}
			if (e.target.value === '') {
				setItemTag(null)
			} else {
				const { data } = await publicFetch.get(
					`/tags/${e.target.value}`, request
				)
				setItemTag(data.tag)
			}
		}
		
	}
	const handlerChooseTag = (tags) => {
		
		if(existsTg(tags)){
			setErr("Tag đã tồn tại trong danh sách");
			setItemTag(null)
		}else{
			setTags([...tag, tags]);
			selectedTags([...tag, tags]);
			setSearch('')
			setItemTag(null)
			setErr(null);
		}	
	}
	return (
		<div className={styles.container}>
			<label className={styles.label}>{label}</label>
			{inputInfo && <p className={styles.inputInfo}>{inputInfo}</p>}
			<div className={styles.tags_input}>

				<ul id={styles.tags}>
					{tag ? tag.map((tag, index) => (
						<li key={index} className={styles.tag}>
							<span className={styles.tag_title}>{tag}</span>
							<span className={styles.tag_close_icon}
								onClick={() => removeTags(index)}
							>
								x
							</span>
						</li>
					)) : ''}
				</ul>
				<input
					type="text"
					onKeyUp={event => event.keyCode === 32 ? addTags(event) : null}
					placeholder="Nhấn space để thêm tag"
					onChange={handlerShow}
					value={search}
					
				/>
			</div>
			{
				itemTag
					? <div className={styles.outline}>
						<ul className={styles.listTag}>
							{
								itemTag.map((item, index) => {
									return <li key={index} className={styles.itemTag} onClick={() => handlerChooseTag(item._id)}>
										<span>{item._id}</span>
										<p>x{item.count}</p>
									</li>
								})
							}
						</ul>
					</div>
					: ''
			}
			{errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : <p className={styles.errorMessage}>{err}</p>}
		</div>


	);
}
export default TagInput;