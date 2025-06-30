import os
from alsalam_app import settings


def get_db_paths(model_class, fields=None):
    """
    Return a set of absolute file paths referenced by all instances of model_class
    for the given FileField/ImageField names.
    """
    if fields is None:
        fields = ['image', 'logo', 'file']

    db_paths = set()
    for obj in model_class.objects.all():
        for field_name in fields:
            file_field = getattr(obj, field_name, None)
            if file_field and hasattr(file_field, 'path'):
                try:
                    db_paths.add(file_field.path)
                except (ValueError, OSError):
                    # Skip missing or invalid file paths
                    continue
    return db_paths


def get_media_paths(dir_root):
    """
    Return a set of all absolute file paths under MEDIA_ROOT/images/dir_root.
    """
    base_path = os.path.join(settings.MEDIA_ROOT, 'images', dir_root)
    media_paths = set()

    if not os.path.isdir(base_path):
        return media_paths

    for root, dirs, files in os.walk(base_path):
        for filename in files:
            media_paths.add(os.path.join(root, filename))
    return media_paths


def get_referenceless_paths(model_class, dir_root, fields=None):
    """
    Return a set of file paths under MEDIA_ROOT/images/dir_root that are not
    referenced by any instance of model_class.
    """
    db_paths = get_db_paths(model_class, fields)
    media_paths = get_media_paths(dir_root)
    # Paths on disk not in database references
    return media_paths - db_paths


def clean_media(model_class, dir_root, fields=None):
    """
    Delete any unreferenced files under MEDIA_ROOT/images/dir_root/ and
    remove empty directories. Return a report dict.
    """
    report = {
        'model': model_class._meta.label,
        'deleted_files': [],
        'deleted_dirs': [],
        'errors': [],
    }

    base_path = os.path.join(settings.MEDIA_ROOT, 'images', dir_root)
    orphan_paths = get_referenceless_paths(model_class, dir_root, fields)

    if not os.path.isdir(base_path):
        report['errors'].append(f"{base_path} does not exist")
        return report

    # Delete orphan files
    for full_path in orphan_paths:
        try:
            os.remove(full_path)
            report['deleted_files'].append(full_path)
        except OSError as e:
            report['errors'].append(f"Unable to delete file {full_path}: {e}")

    # Remove empty directories
    for root, dirs, files in os.walk(base_path, topdown=False):
        try:
            if not os.listdir(root):
                os.rmdir(root)
                report['deleted_dirs'].append(root)
        except OSError as e:
            report['errors'].append(f"Unable to delete dir {root}: {e}")
    # print(f"\n\n\n{report}\n\n\n")
    return report
