# Generated by Django 4.2.1 on 2023-07-07 19:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='conference',
            field=models.TextField(default='', verbose_name='Conference'),
            preserve_default=False,
        ),
    ]
