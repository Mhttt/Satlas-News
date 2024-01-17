import React, {FC, FormEvent, useContext, useState} from 'react'
import { Button, Dialog, DialogContentText, DialogTitle, Divider, FormControl, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, TextField } from '@mui/material';
import { TagsFormProps } from './types';
import DynamicIcon from '../DynamicIcon/DynamicIcon';
import axios, { AxiosError } from 'axios';
import { SnackbarContext } from '../Snackbar/SnackbarContextProvider';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getIcon } from '../DynamicIcon/DynamicIcon';
import NewsArticle from '../../types/NewsArticle';

const TagsForm: FC<TagsFormProps> = ({ tags, open, onClose, setTags }) => {

    const [tag, setTag] = useState<{name: string, icon: string}>({
        name: '',
        icon: '',
    })

    const {
        actions: { openSnackbar },
    } = useContext(SnackbarContext);
    
    const addTag = async () => {
        if (!tag.name || !tag.icon) {
            return;
        }

        if (!getIcon(tag.icon)) {
            openSnackbar('error', 'This icon does not exist, please try another. Ensure proper casing.');
            return;
        }

        try {
            const result = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/tags`, tag);
            tags.push(result.data.tag);
            setTags(tags);
            openSnackbar('success', 'Tag successfully added!');
        }
        catch(e) {
            console.log(e);
            openSnackbar('error', 'Could not create the tag, please try again!');
        }
    }

    const deleteTag = async (id: number) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/tags/${id}`);
            tags = tags.filter(tag => tag.id !== id);
            setTags(tags);
            openSnackbar('success', 'Tag successfully deleted!');
        }
        catch(e: any | AxiosError<Partial<NewsArticle>[]>) {
            if (axios.isAxiosError(e)) {
                if (e.response?.data?.articles) {
                    openSnackbar('error', `This tag is on ${e.response.data.articles.length} article${e.response.data.articles.length > 1 ? 's' : ''}. You need to remove it from those articles first.`);
                }

                return;
            }

            openSnackbar('error', 'Could not delete the tag, please try again!');
        }
    }
    
    return (
        <Dialog 
            open={open}
            onClose={onClose}
        >
            <DialogTitle>All Tags</DialogTitle>

            <List>
                {tags.map((tag) => (
                    <ListItem 
                        key={tag.id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => {deleteTag(tag.id)}}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemIcon>
                            <DynamicIcon name={tag.icon}/>
                        </ListItemIcon>
                        <ListItemText primary={tag.name} sx={{mr: 4}}/>
                    </ListItem>
                ))}
            </List>

            <Divider/>

            <DialogContentText sx={{mt: 1, mb: 1}}>Don't find your tag here? Add one down below!</DialogContentText>

            <form onSubmit={(e) => e.preventDefault()}>
                <FormControl sx={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    <Grid container spacing={2} direction='column' alignItems='center'>
                        <Grid item>
                            <TextField
                                fullWidth
                                id="tag-name"
                                label="Tag Name"
                                name="name"
                                required={true}
                                onChange={(e) => setTag({name: e.target.value, icon: tag.icon})}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="tag-icon"
                                label="Tag Icon"
                                name="icon"
                                required={true}
                                onChange={(e) => setTag({icon: e.target.value, name: tag.name})}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        sx={{
                            display: 'block',
                            mt: 2,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                        variant="contained"
                        onClick={addTag}
                    >
                        Add Tag
                    </Button>

                </FormControl>
            </form>

        </Dialog>
    )
}

export default TagsForm